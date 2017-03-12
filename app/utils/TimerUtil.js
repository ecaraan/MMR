import _ from 'lodash';

export function MinuteToTimer(minuteValue)
{
    let dNow = new Date();
    let dAfter = new Date(dNow.getTime() + (minuteValue * 60 * 1000));
    let distance = dAfter.getTime() - dNow.getTime() ;
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return `${_.padStart(hours, 2, '0')}:${_.padStart(minutes, 2, '0')}:${_.padStart(seconds, 2, '0')}`;
}