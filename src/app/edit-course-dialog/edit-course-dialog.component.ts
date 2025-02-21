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
import { LoadingService } from '../loading/loading.service';
import { finalize } from 'rxjs/operators';

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
  #loadingService = inject(LoadingService);
  fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<EditCourseDialogComponent>);
  readonly data = inject(MAT_DIALOG_DATA) as { course: Course; mode: string };
  readonly course = model(this.data.course);
  protected category = signal<CourseCategory>(this.course().category);

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
        iconUrl: this.course()?.iconUrl,
      });
      this.category.set(this.data?.course?.category);
    }
  }

  protected onCancel() {
    this.dialogRef.close();
  }

  protected onSave() {
    this.#loadingService.show();
    if (this.data.mode === 'edit') {
      const partialCourse = this.form.value as Partial<Course>;
      console.log('Partial course', partialCourse);
      this.courseService
        .saveCourse(this.course().id, partialCourse)
        .pipe(
          finalize(() => {
            this.#loadingService.hide();
          })
        )
        .subscribe({
          next: (course) => {
            this.dialogRef.close(course);
          },
        });
    }

    if (this.data.mode === 'create') {
      const course = this.form.value as Course;
      this.courseService
        .createCourse(course)
        .pipe(
          finalize(() => {
            this.#loadingService.hide();
          })
        )
        .subscribe({
          next: (course: Course) => {
            this.dialogRef.close(course);
          },
        });
    }
  }
}
