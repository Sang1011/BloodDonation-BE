import moment from "moment";

function getToday(){
    const today = moment().startOf('day');
    return today.toDate();
}

function getTomorrow(){
    const tomorrow = moment().add(1, 'day').startOf('day'); 
    return tomorrow.toDate();
}

function getDateRangeFor(dayOffset: number) {
  const from = moment().add(dayOffset, 'day').startOf('day');
  const to = moment(from).add(1, 'day');
  return { from: from.toDate(), to: to.toDate() };
}


export { getToday, getTomorrow, getDateRangeFor }