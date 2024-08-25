import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "dateSuffix"
})
export class DateSuffixPipe implements PipeTransform {
    transform(value: Date | string): string {
        if (!value) return value;

        const date = new Date(value);

        const day = date.getDate();
        const month = date.toLocaleString("default", { month: "long" });
        const year = date.getFullYear();

        const dayWithSuffix = this.addOrdinalSuffix(day);

        return `${dayWithSuffix} ${month}, ${year}`;
    }

    private addOrdinalSuffix(day: number): string {
        if (day > 3 && day < 21) return `${day}th`; // handle teens
        switch (day % 10) {
            case 1:
                return `${day}st`;
            case 2:
                return `${day}nd`;
            case 3:
                return `${day}rd`;
            default:
                return `${day}th`;
        }
    }
}
