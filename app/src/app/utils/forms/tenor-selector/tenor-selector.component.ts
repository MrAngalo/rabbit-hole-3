import { Component, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { TenorResponseObject } from "../../../services/tenor/tenor-types";
import { TenorService } from "../../../services/tenor/tenor.service";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-tenor-selector",
    templateUrl: "./tenor-selector.component.html",
    styleUrl: "./tenor-selector.component.scss",
    standalone: true,
    imports: [CommonModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TenorSelectorComponent),
            multi: true
        }
    ]
})
export class TenorSelectorComponent implements ControlValueAccessor {
    value = "";
    isDisabled = false;

    previewGifUrl = this.tenorService.defaultUrl;
    tenorResults: TenorResponseObject[] = [];
    newGifId = "";

    constructor(private tenorService: TenorService) {}

    onChange = (value: any) => {};
    onTouched = () => {};

    writeValue(value: any): void {
        this.value = value;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    handleInput(event: Event): void {
        this.updateGifPreview(event);
        const target = event.target as HTMLInputElement;
        this.value = target.value;
        this.onChange(this.value);
    }

    handleBlur(): void {
        this.onTouched();
    }

    async updateGifSearch(event: Event) {
        const target = event.target as HTMLInputElement;

        // Trim all spaces of input field
        target.value = target.value.trimStart().replaceAll(/\s\s+/g, " ");

        // Reject all inputs that have been modified quickly, only allow last
        const cached = target.value;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (cached !== target.value) {
            return;
        }

        // Logic starts here
        const query = target.value;

        if (query === undefined || query === null || query === "") {
            this.previewGifUrl = this.tenorService.defaultUrl;
            return;
        }
        this.tenorService.search(query).subscribe({
            next: (data) => {
                this.tenorResults = data.results;
            },
            error: (_) => {
                this.tenorResults = [];
            }
        });
    }

    async updateGifPreview(event: Event) {
        const target = event.target as HTMLInputElement;

        // Trim all spaces of input field
        target.value = target.value.replaceAll(/\s+/g, "");

        // Reject all inputs that have been modified quickly, only allow last
        const cached = target.value;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (cached !== target.value) {
            return;
        }

        // Logic starts here
        const value = target.value;

        if (value === undefined || value === null || value === "") {
            this.previewGifUrl = this.tenorService.defaultUrl;
            return;
        }
        this.tenorService.posts([value]).subscribe({
            next: (data) => {
                this.previewGifUrl =
                    data.results.length != 0
                        ? data.results[0].media_formats.gif.url
                        : this.tenorService.defaultUrl;
            },
            error: (_) => {
                this.previewGifUrl = this.tenorService.defaultUrl;
            }
        });
    }

    tenorResultClick(result: TenorResponseObject) {
        this.newGifId = result.id;
        this.previewGifUrl = result.media_formats.gif.url;
    }
}
