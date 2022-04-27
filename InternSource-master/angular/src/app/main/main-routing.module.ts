import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { DemoComponent } from './danh-muc/demo/demo.component';
import { TestComponent } from './danh-muc/test/test.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                ],
            },
            {
                path: 'danh-muc',
                loadChildren: () => import('./danh-muc/danh-muc.module').then((m) => m.DanhMucModule),
            },
            {
                path: 'test', component: TestComponent,
                canActivate: [AppRouteGuard]
            },

        ]),
    ],
    exports: [RouterModule],
})
export class MainRoutingModule { }
