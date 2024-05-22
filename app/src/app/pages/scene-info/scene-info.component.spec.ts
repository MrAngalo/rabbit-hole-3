import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SceneInfoComponent } from "./scene-info.component";

describe("SceneInfoComponent", () => {
    let component: SceneInfoComponent;
    let fixture: ComponentFixture<SceneInfoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SceneInfoComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(SceneInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
