import React, { useState, useEffect, useRef } from 'react'
import { Entry } from 'components'
import { useEventEditorSelectors } from '@udecode/plate'
import { supabase, arrayEquals, isUnauthorized, logger } from 'utils'
import { useEntriesContext, useUserContext } from 'context'
import dayjs from 'dayjs'
import { BeforeEntries, PostEntries, Wrapper } from './styled'

var visibleSections: String[] = []
var rangeMarker: any
var calendarContainer: any
var scrollToToday: any
var rangeMarkerTop: number

const renderScrollToToday = () => {
  if (!scrollToToday) {
    scrollToToday = document.getElementById('ScrollToToday')
  }
  let today = dayjs().format('YYYY-MM-DD')
  if (visibleSections.some((day) => day == today)) {
    scrollToToday.style.marginBottom = '-32px'
  } else {
    scrollToToday.style.marginBottom = 0
  }
}

const renderMarker = () => {
  visibleSections.sort()

  if (!rangeMarker) {
    rangeMarker = document.getElementById('RangeVisible')
  }

  visibleSections.forEach((date: string, i) => {
    let elem = document.getElementById(`${date}-calendar`)
    if (elem) {
      const top = elem.offsetTop

      if (i == 0) {
        rangeMarkerTop = top
        rangeMarker.style.top = rangeMarkerTop - 2 + 'px'
      }

      if (i == visibleSections.length - 1) {
        let height = top - rangeMarkerTop + elem.offsetHeight + 4 + 'px'
        rangeMarker.style.height = height
      }
    }
  })
}

const onIntersection = (entries: any) => {
  entries.forEach((entry: any) => {
    let date = entry.target.id.slice(0, 10)
    if (entry.isIntersecting) {
      // Add to array
      visibleSections.push(date)
    } else {
      // Remove from array
      visibleSections = visibleSections.filter((v) => {
        return v != date
      })
    }
    renderMarker()
    renderScrollToToday()
  })

  if (!calendarContainer) {
    calendarContainer = document.getElementById('CalendarContainer')
  }

  calendarContainer.scrollTo({
    top: rangeMarkerTop - 48,
    behavior: 'smooth',
  })
}

const entriesObserver = new IntersectionObserver(onIntersection, {
  rootMargin: '-100px',
})

type myref = {
  [id: string]: number
}

const EntryMemo = React.memo(Entry, (prevProps, nextProps) => {
  console.info('New memo compare')
  if (prevProps.entryDay === nextProps.entryDay) {
    return true
  }
  return false
})

function EntryList() {
  const [entries, setEntries] = useState([])
  const [initialFetchDone, setInitialFetchDone] = useState(false)
  const {
    initialCache,
    daysCache,
    setDaysCache,
    shouldScrollToDay,
    clearScrollToDay,
    cacheAddOrUpdateEntry,
    cacheUpdateEntry,
    cacheUpdateEntryProperty,
  } = useEntriesContext()
  const entriesHeight: myref = {}
  const itemsRef = useRef<Array<HTMLDivElement | null>>([])
  var element: HTMLElement | null
  const { session, signOut } = useUserContext()

  logger(`EntryList render`)

  useEffect(() => {
    initialFetch()
  }, [])

  useEffect(() => {
    logger('Entries updated')
  }, [entries])

  useEffect(() => {
    // e.g. user has added a day
    logger('daysCache have changed')
    setEntries([...daysCache])
  }, [daysCache])

  const areDaysEqual = (local: any, server: any) => {
    return arrayEquals(local, server)
  }

  const setEntryHeight = () => {
    if (element) {
      element.scrollIntoView({ block: 'start' })
      // element.scrollTop = 0
    } else {
      let today = dayjs().format('YYYY-MM-DD')
      element = document.getElementById(`${today}-entry`)
    }
  }

  const initialFetch = async () => {
    let cached = daysCache
    if (cached.length) {
      logger('---> Cached entries')
      logger(cached)
      setEntries([...cached])
      setInitialFetchDone(true)
    } else {
      logger('---> No cached entries')
    }

    try {
      let { data: days, error } = await supabase
        .from('journals')
        .select('day')
        .eq('user_id', session.user.id)
        .order('day', { ascending: true })

      if (error) {
        logger(error)
        if (isUnauthorized(error)) signOut()
        throw new Error(error.message)
      }

      days = days.map((d) => (d = d.day.toString()))

      // Add Today to server Days
      let today = dayjs().format('YYYY-MM-DD')
      let todayExists = days.some((el: any) => {
        return el == today
      })
      if (!todayExists) {
        days.push(today)
        logger(`Added ${today} to server Days`)
      }
      if (!areDaysEqual(cached, days)) {
        // Merge two arrays if not equal?
        logger('Cached days not equal to server days, merging...')
        logger(cached)
        logger(days)
        // logger(days)
        if (!Array.isArray(cached)) cached = []
        if (!Array.isArray(days)) days = []

        let merged = [...new Set([...days, ...cached])].sort()
        // setAllCachedDays(merged)
        // setEntries([...merged])
        setDaysCache([...merged])
      } else {
        logger('Cached days equal')
      }
      setInitialFetchDone(true)
    } catch (err) {
      logger(err)
    }
  }

  return (
    <Wrapper>
      <PostEntries></PostEntries>
      {initialFetchDone &&
        entries
          .slice(0)
          .reverse()
          .map((day, i) => (
            <EntryMemo
              key={day}
              entryDay={day}
              entriesObserver={entriesObserver}
              cachedEntry={initialCache.current.find((item: any) => item.day == day)}
              setEntryHeight={setEntryHeight}
              cacheAddOrUpdateEntry={cacheAddOrUpdateEntry}
              cacheUpdateEntry={cacheUpdateEntry}
              cacheUpdateEntryProperty={cacheUpdateEntryProperty}
              shouldScrollToDay={shouldScrollToDay}
              clearScrollToDay={clearScrollToDay}
            />
          ))}
      <BeforeEntries></BeforeEntries>
    </Wrapper>
  )
}

export { EntryList }
