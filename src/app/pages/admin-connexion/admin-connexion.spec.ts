import { ComponentFixture, TestBed } from '@angular/core/testing';
import {AdminConnexionComponent} from './admin-connexion.component';


describe('AdminConnexion', () => {
  let component: AdminConnexionComponent;
  let fixture: ComponentFixture<AdminConnexionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminConnexionComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AdminConnexionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
