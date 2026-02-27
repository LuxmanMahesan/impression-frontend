import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepotFichierComponent } from './depot-fichier.component';

describe('DepotFichierComponent', () => {
  let composant: DepotFichierComponent;
  let fixture: ComponentFixture<DepotFichierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepotFichierComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DepotFichierComponent);
    composant = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('doit être créé', () => {
    expect(composant).toBeTruthy();
  });
});
