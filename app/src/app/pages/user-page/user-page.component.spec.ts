import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UserPageComponent } from "./user-page.component";

describe("UserViewComponent", () => {
    let component: UserPageComponent;
    let fixture: ComponentFixture<UserPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UserPageComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(UserPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
