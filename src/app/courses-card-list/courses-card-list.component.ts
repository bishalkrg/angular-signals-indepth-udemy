import { Component, inject, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Course } from '../models/course.model';
import { MatDialog } from '@angular/material/dialog';
import { EditCourseDialogComponent } from '../edit-course-dialog/edit-course-dialog.component';
import { CoursesService } from '../services/courses.service';
import { finalize, map } from 'rxjs';
import { LoadingService } from '../loading/loading.service';

@Component({
  selector: 'courses-card-list',
  imports: [RouterLink],
  templateUrl: './courses-card-list.component.html',
  styleUrl: './courses-card-list.component.scss',
})
export class CoursesCardListComponent {
  private courseService = inject(CoursesService);
  dialog = inject(MatDialog);
  #loadingService = inject(LoadingService);
  coursesList = input.required<Course[]>();
  updatedCourse = output<Course>();
  deletedCourse = output<Course>();

  protected openEditCourseDialog(course: Course) {
    console.log('Edit course', course);
    const dialogRef = this.dialog.open(EditCourseDialogComponent, {
      data: { course: course, mode: 'edit' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
      if (result != undefined) {
        this.updatedCourse.emit(result);
      }
    });
  }

  protected deleteCourse(course: Course) {
    this.#loadingService.show();
    this.courseService
      .deleteCourse(course.id)
      .pipe(
        finalize(() => {
          this.#loadingService.hide();
        })
      )
      .subscribe((id) => {
        if (id != undefined) {
          this.deletedCourse.emit(course);
        }
      });
  }
}
