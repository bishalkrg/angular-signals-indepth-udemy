import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, firstValueFrom, map, Observable, throwError } from 'rxjs';
import { Course, sortCoursesBySeqNo } from '../models/course.model';
import { GetCoursesResponse } from '../models/get-courses.response';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private url = 'http://localhost:9000/api/';

  private http = inject(HttpClient);

  public loadAllCourses(): Observable<Course[]> {
    return this.http
      .get<GetCoursesResponse>(this.url + 'courses', { responseType: 'json' })
      .pipe(
        map((response) => {
          response.courses.sort(sortCoursesBySeqNo);
          return response.courses;
        }),
        catchError(() => {
          return throwError(() => new Error('Error loading courses'));
        })
      );
  }

  public AddCourse(course: Course) {
    return this.http.post<Course>(this.url + 'courses', course).pipe(
      catchError(() => {
        return throwError(() => new Error('Error adding course'));
      })
    );
  }

  public saveCourse(courseId: string, change: Partial<Course>) {
    return this.http.put<Course>(this.url + 'courses/' + courseId, change).pipe(
      catchError(() => {
        return throwError(() => new Error('Error saving course'));
      })
    );
  }

  public deleteCourse(courseId: string):Observable<string> {
    return this.http.delete<string>(this.url + 'courses/' + courseId).pipe(
      catchError(() => {
        return throwError(() => new Error('Error deleting course'));
      })
    );
  }
}
