import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { RecipeDetailComponent } from './recipe-detail.component';
import { RecettesService } from '../../services/RecettesService';
import { IngredientsService } from '../../services/IngredientsService';

describe('RecipeDetailComponent', () => {
  let component: RecipeDetailComponent;
  let fixture: ComponentFixture<RecipeDetailComponent>;

  beforeEach(async () => {
    const mockRecettesService = {
      getById: () => of({
        id: '1',
        name: 'Burger',
        description: 'Délicieux burger fondant',
        composition: [{ idIngredient: '1', quantity: 2 }],
        rates: [{ login: 'Chef', rate: 5, review: 'Super' }]
      }),
      getRecipeAverage: () => 5,
      addReview: () => of({})
    };

    const mockIngredientsService = {
      list: () => of([{ id: '1', name: 'Pain' }])
    };

    await TestBed.configureTestingModule({
      imports: [RecipeDetailComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '1'
              }
            }
          }
        },
        { provide: RecettesService, useValue: mockRecettesService },
        { provide: IngredientsService, useValue: mockIngredientsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should resolve ingredient name', () => {
    expect(component.getIngredientName('1')).toBe('Pain');
  });
});
