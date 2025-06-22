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
    private _isDisabled = false;
    private _previewGifUrl = this.tenorService.defaultUrl;
    private _tenorResults: TenorResponseObject[] = [];
    private _gifId = "";

    private onChange = (value: any) => {};
    private onTouched = () => {};

    constructor(private tenorService: TenorService) {}

    get isDisabled() {
        return this._isDisabled;
    }

    get previewGifUrl() {
        return this._previewGifUrl;
    }

    get tenorResults() {
        return this._tenorResults;
    }

    get gifId() {
        return this._gifId;
    }

    writeValue(value: any): void {
        this._gifId = value;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this._isDisabled = isDisabled;
    }

    handleBlur(): void {
        this.onTouched();
    }

    manualGifIdInput(event: Event): void {
        const target = event.target as HTMLInputElement;
        this._gifId = target.value;
        this.updateGifPreview(event);
        this.onChange(this._gifId);
    }

    tenorResultClick(result: TenorResponseObject) {
        this._gifId = result.id;
        this._previewGifUrl = result.media_formats.gif.url;
        this.onChange(this._gifId);
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
            this._tenorResults = [];
            return;
        }
        const s = this.tenorService.search(query).subscribe({
            next: (data) => {
                this._tenorResults = data.results;
                s.unsubscribe();
            },
            error: (_) => {
                this._tenorResults = [];
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
            this._previewGifUrl = this.tenorService.defaultUrl;
            return;
        }
        this.tenorService.posts([value]).subscribe({
            next: (data) => {
                this._previewGifUrl =
                    data.results.length != 0
                        ? data.results[0].media_formats.gif.url
                        : this.tenorService.defaultUrl;
            },
            error: (_) => {
                this._previewGifUrl = this.tenorService.defaultUrl;
            }
        });
    }
}
