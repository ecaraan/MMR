import _ from 'lodash';

export function MinuteToTimer(minuteValue)
{
    let dNow = new Date();
    let dAfter = new Date(dNow.getTime() + (minuteValue * 60 * 1000));
    return MillisecodsToText(dAfter.getTime() - dNow.getTime());    
}

export function MillisecodsToText(timeValue){
    let hours = Math.floor((timeValue % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((timeValue % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((timeValue % (1000 * 60)) / 1000);

    return `${_.padStart(hours, 2, '0')}:${_.padStart(minutes, 2, '0')}:${_.padStart(seconds, 2, '0')}`;
}

export function MillisecodsToText2(timeValue){
    let hours = Math.floor((timeValue % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((timeValue % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((timeValue % (1000 * 60)) / 1000);

    return `${hours} hr ${minutes} min ${seconds} sec`;
}

export function CountDownTime(minuteValue, elapsedTime){
    let dNow = new Date();
    let dAfter = new Date(dNow.getTime() + (minuteValue * 60 * 1000));
    return MillisecodsToText(dAfter.getTime() - dNow.getTime() - elapsedTime);
}
