import { Component, effect, inject, model, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Course } from '../models/course.model';
import { EditCourseDialogData } from './edit-course-dialog.data.model';
import { CoursesService } from '../services/courses.service';
import { LoadingIndicatorComponent } from '../loading/loading.component';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CourseCategoryComboboxComponent } from '../course-category-combobox/course-category-combobox.component';
import { CourseCategory } from '../models/course-category.model';

@Component({
  selector: 'edit-course-dialog',
  standalone: true,
  imports: [
    LoadingIndicatorComponent,
    ReactiveFormsModule,
    CourseCategoryComboboxComponent,
    FormsModule,
    MatDialogModule,
  ],
  templateUrl: './edit-course-dialog.component.html',
  styleUrl: './edit-course-dialog.component.scss',
})
export class EditCourseDialogComponent {
  private courseService = inject(CoursesService);
  fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<EditCourseDialogComponent>);
  readonly data = inject(MAT_DIALOG_DATA) as { course: Course; mode: string };
  readonly course = model(this.data.course);

  form = this.fb.group({
    title: ['', Validators.required],
    longDescription: [''],
    category: ['', Validators.required],
    iconUrl: [''],
  });

  constructor() {
    if (this.data.mode === 'edit') {
      this.form.patchValue({
        title: this.course()?.title,
        longDescription: this.course()?.longDescription,
        category: this.course()?.category,
        iconUrl: this.course()?.iconUrl,
      });
    }
  }

  protected onCancel() {
    this.dialogRef.close();
  }

  protected onSave() {
    if (this.data.mode === 'edit') {
      const partialCourse = this.form.value as Partial<Course>;
      console.log('Partial course', partialCourse);
      this.courseService.saveCourse(this.course().id, partialCourse).subscribe({
        next: (course) => {
          this.dialogRef.close(course);
        },
      });
    }

    if (this.data.mode === 'create') {
      const course = this.form.value as Course;
      this.courseService.createCourse(course).subscribe({
        next: (course) => {
          this.dialogRef.close(course);
        },
      });
    }
  }
}
