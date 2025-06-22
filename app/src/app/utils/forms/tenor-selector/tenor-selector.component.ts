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
    isDisabled = false;

    previewGifUrl = this.tenorService.defaultUrl;
    tenorResults: TenorResponseObject[] = [];
    gifId = "";

    constructor(private tenorService: TenorService) {}

    onChange = (value: any) => {};
    onTouched = () => {};

    writeValue(value: any): void {
        this.gifId = value;
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

    handleBlur(): void {
        this.onTouched();
    }

    manualGifIdInput(event: Event): void {
        const target = event.target as HTMLInputElement;
        this.gifId = target.value;
        this.updateGifPreview(event);
        this.onChange(this.gifId);
    }

    tenorResultClick(result: TenorResponseObject) {
        this.gifId = result.id;
        this.previewGifUrl = result.media_formats.gif.url;
        this.onChange(this.gifId);
    }

    async updateGifSearch(event: Event) {
        const target = event.target as HTMLInputElement;

        // Reject all inputs that have been modified quickly, only allow last
        const cached = target.value;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (cached !== target.value) {
            return;
        }

        // Logic starts here
        const query = target.value.trim();

        if (query === undefined || query === null || query === "") {
            this.tenorResults = [];
            return;
        }
        const s = this.tenorService.search(query).subscribe({
            next: (data) => {
                this.tenorResults = data.results;
                s.unsubscribe();
            },
            error: (_) => {
                this.tenorResults = [];
                s.unsubscribe();
            }
        });
    }

    async updateGifPreview(event: Event) {
        const target = event.target as HTMLInputElement;

        // Reject all inputs that have been modified quickly, only allow last
        const cached = target.value;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (cached !== target.value) {
            return;
        }

        // Logic starts here
        const value = target.value.trim();

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
}
