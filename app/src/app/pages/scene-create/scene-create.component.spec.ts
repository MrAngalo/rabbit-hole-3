import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SceneCreateComponent } from "./scene-create.component";

describe("SceneCreateComponent", () => {
    let component: SceneCreateComponent;
    let fixture: ComponentFixture<SceneCreateComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SceneCreateComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(SceneCreateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
