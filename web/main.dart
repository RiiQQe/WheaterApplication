//The WeatherAppModule called from the main function binds 
//all components and makes the code run in the right order

library main;

import 'package:angular/application_factory.dart';
import 'package:angular/angular.dart';

import 'package:weatherapplication/component/weather_data.dart';

import 'package:bootjack/bootjack.dart';

import 'dart:html';


import 'dart:js' as js;

///Binds all components of the app right now it consists of
///[WeatherDataComponent]
class WeatherAppModule extends Module {
  WeatherAppModule() {
   
    bind(WeatherDataComponent);
  
  }
}

main() {
  
  applicationFactory().addModule(new WeatherAppModule()).run();
  
 
  Dropdown.use();
  
  
}
//TODO: flytta till weatherData
///Removes the splash screen after the data are loaded and display the app


