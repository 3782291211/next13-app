'use client';

import ErrorMessage from '../components/ErrorMessage';
import ConfirmationMessage from '../components/ConfirmationMessage';
import { getExams } from '../api/apiRequests';
import { useEffect, useContext, useState } from 'react';
import { LoggedInUserContext } from '../context/store';
import { formatDateString } from '../helpers/examPageHelpers';
import userIsAdmin from '../helpers/userIsAdmin';
import { notFound } from 'next/navigation';
import TextSection from '../components/TextSection';
import errorHandler from '../helpers/errorHandler';
import 'react-calendar/dist/Calendar.css';
import ViewControls from './ViewControls';
import DataControls from './DataControls';
import CalendarControls from './Calendar';
import DisplayView from './DisplayView';

const ExamsPage = () => {
// States concerned with fetching of exam data
const [exams, setExams] = useState<Exam[] | []>([]);
const [isLoading, setIsLoading] = useState(false);
const { loggedInUser } = useContext(LoggedInUserContext);
const [confirmationMsg, setConfirmationMsg] = useState('');
const [errorMsg, setErrorMsg] = useState({ value: '', show: ''});

// Allow user to select list or map view
const [view, setView] = useState('list');

// Pagination states
const [pageLinks, setPageLinks] = useState<PageLinks>({prev: '', next: ''});
const [pageControl, setPageControl] = useState(1);
const [currentPage, setCurrentPage] = useState(1);
const [limit, setLimit] = useState(30);
const [totalPages, setTotalPages] = useState<number | string>('');
const [totalResults, setTotalResults] = useState('');

// States concerned with query parameters
const [query, setQuery] = useState('Name');
const [candidateName, setCandidateName] = useState('');
const [location, setLocation] = useState('');
const [date, setDate] = useState<Date | ''>('');
const [month, setMonth] = useState('');
const [year, setYear] = useState('');
const [order, setOrder] = useState('DESC');

// Scrolls to top, onto the confirmation message
useEffect(() => {
  if (confirmationMsg) {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }
}, [confirmationMsg]);

// Fetch exam data in response to change in name/location/date/month/page/limit
useEffect(() => {
  if (!loggedInUser.user?.id || !userIsAdmin(loggedInUser)) {
    notFound();
  }
  setErrorMsg({value: '', show: ''});
  setIsLoading(true);
  getExams(loggedInUser.token!, candidateName, location, formatDateString(date), month, year, limit, pageControl, order)
  .then(({exams, meta : { current_page: page, last_page: pageCount, total }, links : { prev, next }}) => {
    setIsLoading(false);
    setExams(exams);
    setPageLinks({prev, next});
    setCurrentPage(page);
    setTotalPages(pageCount);
    setTotalResults(total);
 })
 .catch(err => {
    setIsLoading(false);
    setErrorMsg({show: '', value: errorHandler(err)});
 });  
}, [candidateName, location, date, month, year, limit, pageControl, order]);

// Reset results to first page if new query is detected
useEffect(() => {
  setPageControl(1);
}, [candidateName, location, date, month, year, limit]);


return (
  <main className="pb-20 mx-auto w-11/12 sm:w-5/6">
    <section>
      {confirmationMsg && <ConfirmationMessage confirmationMsg={confirmationMsg} setConfirmationMsg={setConfirmationMsg}/>}
      <TextSection view={view}/>
      <ViewControls setView={setView} loggedInUser={loggedInUser}/>
      {errorMsg.value && errorMsg.show && <ErrorMessage errorMsg={errorMsg} setErrorMsg={setErrorMsg}/>}
      {!errorMsg.value && 
        <section>
          <CalendarControls setDate={setDate} setMonth={setMonth} setYear={setYear} exams={exams}/>
          <DataControls query={query} setQuery={setQuery} setDate={setDate} setLocation={setLocation} setCandidateName={setCandidateName} totalResults={totalResults} currentPage={currentPage} totalPages={totalPages} pageLinks={pageLinks} pageControl={pageControl} setPageControl={setPageControl} candidateName={candidateName} setLimit={setLimit} setOrder={setOrder} limit={limit} order={order} view={view} location={location}/>
       </section>}
    </section>
      <DisplayView exams={exams} setExams={setExams} errorMsg={errorMsg} isLoading={isLoading} loggedInUser={loggedInUser} date={date} month={month} year={year} view={view} setConfirmationMsg={setConfirmationMsg}/>
  </main>
);
};

export default ExamsPage;