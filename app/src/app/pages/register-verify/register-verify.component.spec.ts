import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RegisterVerifyComponent } from "./register-verify.component";

describe("PasswordResetComponent", () => {
    let component: RegisterVerifyComponent;
    let fixture: ComponentFixture<RegisterVerifyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RegisterVerifyComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(RegisterVerifyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
