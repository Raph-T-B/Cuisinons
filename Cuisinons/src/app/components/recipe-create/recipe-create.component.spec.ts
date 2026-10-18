import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { RecipeCreateComponent } from './recipe-create.component';
import { RecettesService } from '../../services/RecettesService';
import { IngredientsService } from '../../services/IngredientsService';

describe('RecipeCreateComponent', () => {
  let component: RecipeCreateComponent;
  let fixture: ComponentFixture<RecipeCreateComponent>;

  beforeEach(async () => {
    const mockRecettesService = {
      AjtRecette: () => of({ id: '99', name: 'Test', description: 'Desc...', composition: [], rates: [] })
    };
    const mockIngredientsService = {
      list: () => of([{ id: '1', name: 'Pain' }, { id: '2', name: 'Steak' }]),
      addIngredients: () => of({ id: '3', name: 'Tomate' })
    };

    await TestBed.configureTestingModule({
      imports: [RecipeCreateComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: RecettesService, useValue: mockRecettesService },
        { provide: IngredientsService, useValue: mockIngredientsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeCreateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate name, description >= 30 chars, and minimum 2 ingredients', () => {
    component.name = 'Cheeseburger maison';
    component.description = 'Voici une recette de cheeseburger particulièrement savoureux et moelleux.';
    component.compositionRows = [
      { idIngredient: '1', quantity: 2 },
      { idIngredient: '2', quantity: 1 }
    ];

    expect(component.isNameValid).toBe(true);
    expect(component.isDescriptionValid).toBe(true);
    expect(component.hasMinimumIngredients).toBe(true);
    expect(component.isFormValid).toBe(true);
  });

  it('should prevent adding duplicate ingredient already present in available list (case-insensitive)', () => {
    component.newIngredientName = 'pain';
    component.onQuickAddIngredient();

    expect(component.newIngredientError).toContain('existe déjà');
    expect(component.availableIngredients.length).toBe(2);
  });

  it('should successfully add a new unique ingredient', () => {
    component.newIngredientName = 'Tomate';
    component.onQuickAddIngredient();

    expect(component.newIngredientError).toBe('');
    expect(component.availableIngredients.some(ing => ing.name === 'Tomate')).toBe(true);
    expect(component.showNewIngredientModal).toBe(false);
  });
});
