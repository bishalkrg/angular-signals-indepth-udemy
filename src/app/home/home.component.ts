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

@Component({
  selector: 'home',
  imports: [MatTabGroup, MatTab, CoursesCardListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private courseService = inject(CoursesService);

  //courses = toSignal(this.courseService.loadAllCourses(), { initialValue: [] });

  courses = signal<Course[]>([]);

  constructor() {
    this.courseService.loadAllCourses().subscribe((courses) => {
      this.courses.set(courses);
    });
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
}
