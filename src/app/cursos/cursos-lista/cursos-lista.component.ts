import { Component, OnInit } from '@angular/core';
import { CursosService } from './../cursos.service';
import { Curso } from '../curso';
import { Observable, of, Subject, empty } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-cursos-lista',
  templateUrl: './cursos-lista.component.html',
  styleUrls: ['./cursos-lista.component.scss'],
  preserveWhitespaces: true
})
export class CursosListaComponent implements OnInit {

  // cursos: Curso[];
  cursos$: Observable<Curso[]>;
  error$ = new Subject<boolean>();

  constructor(private service: CursosService) { }

  ngOnInit(): void {
    this.onRefresh();
  }

  onRefresh() {
    // this.service.list().subscribe(dados => this.cursos = dados);
    this.cursos$ = this.service.list()
      .pipe(
        catchError(error => {
          console.error(error);
          // return empty();
          this.error$.next(true);
          return of();
        })
      );

    this.service.list()
    .pipe(
      catchError( // Sempre como ultimo operador do PIPE
        error => empty()
      )
    )
    .subscribe(
      dados => {
        console.log(dados);
      },
      error => console.error(error),
      () => console.log('Observable completo!')
    );
  }
}
