import arrowBack from "../assets/icons/arrow-back.png";
import arrowDown from "@/assets/icons/arrow-down.png";
import arrowRight from "@/assets/icons/arrow-right.png";
import bag from "@/assets/icons/bag.png";
import check from "@/assets/icons/check.png";
import clock from "@/assets/icons/clock.png";
import dollar from "@/assets/icons/dollar.png";
import envelope from "@/assets/icons/envelope.png";
import home from "@/assets/icons/home.png";
import location from "@/assets/icons/location.png";
import logout from "@/assets/icons/logout.png";
import minus from "@/assets/icons/minus.png";
import pencil from "@/assets/icons/pencil.png";
import person from "@/assets/icons/person.png";
import phone from "@/assets/icons/phone.png";
import plus from "@/assets/icons/plus.png";
import search from "@/assets/icons/search.png";
import star from "@/assets/icons/star.png";
import trash from "@/assets/icons/trash.png";
import user from "@/assets/icons/user.png";
import emptyState from "@/assets/images/empty-state.png";
import success from "@/assets/images/success.png";

import avatar from "@/assets/images/avatar.png";
import burgerOne from "@/assets/images/burger-one.png";
import burgerTwo from "@/assets/images/burger-two.png";
import pizzaOne from "@/assets/images/pizza-one.png";
import loginGraphic from "@/assets/images/login-graphic.png";
import buritto from "@/assets/images/buritto.png";
import logo from "@/assets/images/logo.png";

import avocado from "@/assets/images/avocado.png";
import cheese from "@/assets/images/cheese.png";
import coleslaw from "@/assets/images/coleslaw.png";
import cucumber from "@/assets/images/cucumber.png";
import fries from "@/assets/images/fries.png";
import mozarellaSticks from "@/assets/images/mozarella-sticks.png";
import mushrooms from "@/assets/images/mushrooms.png";
import onionRings from "@/assets/images/onion-rings.png";
import onions from "@/assets/images/onions.png";
import salad from "@/assets/images/salad.png";
import tomatoes from "@/assets/images/tomatoes.png";
import coke from '@/assets/images/COCACOLA.jpg';

export const CATEGORIES = [
    {
        id: "1",
        name: "All",
    },
    {
        id: "2",
        name: "Burger",
    },
    {
        id: "3",
        name: "Pizza",
    },
    {
        id: "4",
        name: "Wrap",
    },
    {
        id: "5",
        name: "Burrito",
    },
];
//deals are comming locally not from appwrite but we are also making them in database for people to search through search component
export const OFFERS = [
  {
    id: "1",
    title: "SUMMER COMBO",
    image: burgerOne,
    color: "#D33B0D",
    price: 50,
    description: "Burger, fries, and coke at a special price!",
    calories: 540,
    protein: "30g",
  },
  {
    id: "2",
    title: "BURGER BASH",
    image: burgerTwo,
    color: "#DF5A0C",
    price: 30.5,
    description: "Extra cheesy delight for cheese lovers.",
    calories: 300, // update later if you know
    protein: '30g',
  },
  {
    id: "3",
    title: "PIZZA PARTY",
    image: pizzaOne,
    color: "#084137",
    price: 12.0,
    description: "Smoky BBQ chicken topped with tangy sauce.",
    calories: null,
    protein: null,
  },
  {
    id: "4",
    title: "BURRITO DELIGHT",
    image: buritto,
    color: "#EB920C",
    price: 9.5,
    description: "Loaded beef burrito with smoky seasoning.",
    calories: null,
    protein: null,
  },
];


export const sides = [
    {
        name: "Fries",
        image: fries,
        price: 3.5,
    },
    {
        name: "Onion Rings",
        image: onionRings,
        price: 4.0,
    },
    {
        name: "Mozarella Sticks",
        image: mozarellaSticks,
        price: 5.0,
    },
    {
        name: "Coleslaw",
        image: coleslaw,
        price: 2.5,
    },
    {
        name: "Salad",
        image: salad,
        price: 4.5,
    },
];

export const toppings = [
    {
        name: "Avocado",
        image: avocado,
        price: 1.5,
    },
   
    {
        name: "Cheese",
        image: cheese,
        price: 1.0,
    },
    {
        name: "Cucumber",
        image: cucumber,
        price: 0.5,
    },
    {
        name: "Mushrooms",
        image: mushrooms,
        price: 1.2,
    },
    {
        name: "Onions",
        image: onions,
        price: 0.5,
    },
    {
        name: "Tomatoes",
        image: tomatoes,
        price: 0.7,
    },
];

export const images = {
    avatar,
    avocado,
    burgerOne,
    burgerTwo,
    buritto,
    cheese,
    coleslaw,
    cucumber,
    emptyState,
    fries,
    loginGraphic,
    logo,
    mozarellaSticks,
    mushrooms,
    onionRings,
    onions,
    pizzaOne,
    salad,
    success,
    tomatoes,
    arrowBack,
    arrowDown,
    arrowRight,
    bag,
    check,
    clock,
    dollar,
    envelope,
    home,
    location,
    logout,
    minus,
    pencil,
    person,
    phone,
    plus,
    search,
    star,
    trash,
    user,
    coke,
};