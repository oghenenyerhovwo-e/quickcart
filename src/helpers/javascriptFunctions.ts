import moment from "moment"

export const getTimeAgo = (time: any) => {
    moment.updateLocale('en', {
        relativeTime : {
            future: "in %s",
            past:   "%s ago",
            s  : 'a few seconds',
            ss : '%d seconds',
            m:  "a minute",
            mm: "%d minutes",
            h:  "1 hour ago", //this is the setting that you need to change
            hh: "%d hours",
            d:  "a day",
            dd: "%d days",
            w:  "a week",
            ww: "%d weeks",
            M:  "1 month ago", //change this for month
            MM: "%d months",
            y:  "a year",
            yy: "%d years"
        }
    });
    return moment(time).fromNow();
}

export const toFirstLetterUpperCase  = (str: string) => {
    return str[0].toUpperCase() + str.slice(1)
}

export const trimContent = (content: string, maxLength: number) => {
    // Check if the content length is already less than or equal to maxLength
    if (content.length <= maxLength) {
        return content;
    }

    // Find the next complete word after maxLength characters
    const nextWordIndex = content.indexOf(' ', maxLength);
    const trimmedContent = content.substring(0, nextWordIndex) + '...';

    return trimmedContent;
}