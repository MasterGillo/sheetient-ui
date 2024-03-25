import { NgModule } from '@angular/core';

import { HomeRoutingModule } from './home-routing.module';
import { LoginComponent } from './components/login/login.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';

@NgModule({
    declarations: [LoginComponent, HomeComponent, RegisterComponent],
    imports: [HomeRoutingModule, SharedModule],
})
export class HomeModule {}
