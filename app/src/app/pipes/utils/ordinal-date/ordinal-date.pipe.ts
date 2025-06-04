import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "ordinalDate"
})
export class OrdinalDatePipe implements PipeTransform {
    transform(value: Date): string {
        const day = value.getDate();
        const month = value.toLocaleString("default", { month: "long" });
        const year = value.getFullYear();

        const suffix = (d: number) => {
            if (d > 3 && d < 21) return "th";
            switch (d % 10) {
                case 1:
                    return "st";
                case 2:
                    return "nd";
                case 3:
                    return "rd";
                default:
                    return "th";
            }
        };

        return `${day}${suffix(day)} ${month}, ${year}`;
    }
}
