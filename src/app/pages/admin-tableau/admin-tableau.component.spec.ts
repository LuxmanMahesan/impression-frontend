import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminTableauComponent } from './admin-tableau.component';

describe('AdminTableauComponent', () => {
  let composant: AdminTableauComponent;
  let fixture: ComponentFixture<AdminTableauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTableauComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTableauComponent);
    composant = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('doit être créé', () => {
    expect(composant).toBeTruthy();
  });
});
