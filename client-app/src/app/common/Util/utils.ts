//class that contains additional functions

//function for extracting time
export const combineDateAndTime = (date: Date, time: Date) => {

    //getting the time
    const timeString = time.getHours() + ':' + time.getMinutes() + ':00'

    //getting the date
    const year = date.getFullYear();
    const month = date.getMonth() +  1; // adding '+1' since "getMonth()" starts from 0
    const day = date.getDate();
    const dateString = `${year}-${month}-${day}`

    return new Date(dateString + ' ' + timeString);

}
