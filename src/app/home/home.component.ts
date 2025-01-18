import {
  Component,
  computed,
  effect,
  inject,
  Injector,
  signal,
} from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { Course, sortCoursesBySeqNo } from '../models/course.model';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { CoursesCardListComponent } from '../courses-card-list/courses-card-list.component';
import { MatDialog } from '@angular/material/dialog';
import { MessagesService } from '../messages/messages.service';
import { catchError, from, throwError } from 'rxjs';
import {
  toObservable,
  toSignal,
  outputToObservable,
  outputFromObservable,
} from '@angular/core/rxjs-interop';
import { EditCourseDialogComponent } from '../edit-course-dialog/edit-course-dialog.component';
import { LoadingService } from '../loading/loading.service';

@Component({
  selector: 'home',
  imports: [MatTabGroup, MatTab, CoursesCardListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private courseService = inject(CoursesService);
  private dialog = inject(MatDialog);
  private loadingService = inject(LoadingService);

  //courses = toSignal(this.courseService.loadAllCourses(), { initialValue: [] });

  courses = signal<Course[]>([]);

  constructor() {
    this.loadingService.show();
    this.courseService.loadAllCourses().subscribe((courses) => {
      this.courses.set(courses);
    });
    this.loadingService.hide();
  }

  beginnerCourses = computed(() => {
    return this.courses().filter((course) => course.category === 'BEGINNER');
  });

  intermediateCourses = computed(() => {
    return this.courses().filter(
      (course) => course.category === 'INTERMEDIATE'
    );
  });

  advancedCourses = computed(() => {
    return this.courses().filter((course) => course.category === 'ADVANCED');
  });

  protected openAddCourseDialog() {
    console.log('Add course');
    const dialogRef = this.dialog.open(EditCourseDialogComponent, {
      data: { mode: 'create' },
    });

    dialogRef.afterClosed().subscribe((course) => {
      console.log('The dialog was closed', course);
      if (course) {
        this.courses.set([...this.courses(), course]);
      }
    });
  }

  protected onUpdatedCourse(updatedCourse: Course) {
    console.log('Home component received updated course', updatedCourse);

    if (updatedCourse) {
      const courses = this.courses();
      const newCourses = courses.map((course) =>
        course.id === updatedCourse.id ? updatedCourse : course
      );
      this.courses.set(newCourses);
    }
  }

  protected onDeleteCourse(deletedCourse: Course) {
    if (deletedCourse) {
      const newCourse = this.courses().filter(
        (course) => course.id !== deletedCourse.id
      );
      this.courses.set(newCourse);
    }
  }
}
