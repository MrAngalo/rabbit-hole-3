import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TenorSelectorComponent } from "./tenor-selector.component";

describe("TenorSelectorComponent", () => {
    let component: TenorSelectorComponent;
    let fixture: ComponentFixture<TenorSelectorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TenorSelectorComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(TenorSelectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
