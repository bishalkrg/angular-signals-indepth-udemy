import { Component, input, InputSignal, model } from '@angular/core';
import { CourseCategory } from '../models/course-category.model';

@Component({
  selector: 'course-category-combobox',
  standalone: true,
  imports: [],
  templateUrl: './course-category-combobox.component.html',
  styleUrl: './course-category-combobox.component.scss',
})
export class CourseCategoryComboboxComponent {
  //protected selectedCourseCategory = model.required<CourseCategory>();
  label = input.required<string>();
  value = model.required<CourseCategory>();

  protected onCategoryChanged(category: string) {
    this.value.set(category as CourseCategory);
  }
}
