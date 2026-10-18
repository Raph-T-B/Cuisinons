import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { RecipeListComponent } from './recipe-list.component';
import { RecettesService } from '../../services/RecettesService';

describe('RecipeListComponent', () => {
  let component: RecipeListComponent;
  let fixture: ComponentFixture<RecipeListComponent>;

  beforeEach(async () => {
    const mockRecettesService = {
      liste: () => of([
        { id: '1', name: 'Burger', description: 'Une super description de plus de 30 caractères', composition: [], rates: [] }
      ]),
      getRecipeAverage: () => 4.5
    };

    await TestBed.configureTestingModule({
      imports: [RecipeListComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: RecettesService, useValue: mockRecettesService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter recipes by search term', () => {
    component.searchTerm = 'Burger';
    expect(component.filteredRecipes.length).toBe(1);

    component.searchTerm = 'Pizza';
    expect(component.filteredRecipes.length).toBe(0);
  });
});
