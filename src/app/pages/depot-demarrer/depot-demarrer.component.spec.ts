import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepotDemarrerComponent } from './depot-demarrer.component';

describe('DepotDemarrerComponent', () => {
  let composant: DepotDemarrerComponent;
  let fixture: ComponentFixture<DepotDemarrerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepotDemarrerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DepotDemarrerComponent);
    composant = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('doit être créé', () => {
    expect(composant).toBeTruthy();
  });
});
