import { Component, inject, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Course } from '../models/course.model';
import { MatDialog } from '@angular/material/dialog';
import { EditCourseDialogComponent } from '../edit-course-dialog/edit-course-dialog.component';
import { CoursesService } from '../services/courses.service';

@Component({
  selector: 'courses-card-list',
  imports: [RouterLink],
  templateUrl: './courses-card-list.component.html',
  styleUrl: './courses-card-list.component.scss',
})
export class CoursesCardListComponent {
  private courseService = inject(CoursesService);
  dialog = inject(MatDialog);
  coursesList = input.required<Course[]>();

  protected openEditCourseDialog(course: Course) {
    console.log('Edit course', course);
    const dialogRef = this.dialog.open(EditCourseDialogComponent, {
      data: { course: course },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.courseService.saveCourse(result.id, result).subscribe();
      }
    });
  }
}
