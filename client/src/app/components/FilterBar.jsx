'use client'
import LocationFilter from "./LocationFilter";
import { useDispatch } from "react-redux";
import {filterCompaniesByName, filterCompaniesByCategorie, filterCompaniesBySubcategorie } from "@/app/redux/features/companieSlice";
import { useGetCategoriesQuery } from '../redux/services/categoriesApi';
import Select from 'react-select';

import { useState } from "react";

const employerNumber = [
  "Menos de 50 empleados",
  "De 50 a 200 empleados",
  "De 200 a 1000 empleados",
  "De 1000 a 5000 empleados",
  "Mas de 5000 empleados",
];

function FilterBar() {
  const dispatch = useDispatch();

  const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const [search, setSearch] = useState("");
  const [categorieSelected, setCategorieSelected] = useState([])
  const [subCatSelected, setSubCatSelected] = useState([])



  const handleSearch = (e) => {
    const name = e.target.value;
    setSearch(name);
  };

  const handleChangeCategories = (e) => {
    //crear las subcategorias para el select
    const subcategories = categories?.find(cat => cat.id === e.value).subcategories
    setSubCatSelected(subcategories.map(subcat => ({label:subcat.name, value:subcat.id})))      
    //mandar a redux las categorias seleccionada para modificar el filterCompanies
    dispatch(filterCompaniesByCategorie(e.value))
    //setear su propio estado para no perder la referencia
    setCategorieSelected(e)
  }
  
  const handleSubcategorieChange = (e) => {
    dispatch(filterCompaniesBySubcategorie(e.value))
    // setSubCatSelected(e)
  }
  

  const searchCompanies = () => {
    dispatch(filterCompaniesByName(search));
  };

  return (
    <div className="flex flex-col justify-items-stretch">
      <div className="bg-white p-8 mb-4">
        <div className="p-2 border-b-2 border-gray-300 mb-4 ">
          <h3 className="text-base">Buscador</h3>
        </div>
        <div>
          <input
            type="text"
            placeholder="Buscar Empresa"
            className="border-1 border-gray-400 p-3 rounded-sm text-sm focus:outline-none focus:border-secondary-500-500 focus:ring-1 focus:ring-secondary-500 w-full"
            onChange={handleSearch}
          />
        </div>
        <div className="mt-2">
          <button
            className="bg-primary-500 w-full text-white p-2 rounded-sm font-bold hover:bg-primary-400"
            onClick={searchCompanies}
          >
            Buscar
          </button>
        </div>
      </div>
      <div className="bg-white p-8 mb-4">
        <div className="p-2 border-b-2 border-gray-300 mb-4">
          <h3 className="text-base">Ubicación</h3>
        </div>
        <div>
          <LocationFilter />
        </div>
      </div>
      <div className="bg-white p-8 mb-4">
        <div className="p-2 border-b-2 border-gray-300 mb-4">
          <h3 className="text-base inline-flex mr-1">Categoria: </h3>
          <span className="inline-flex mr-1 text-xs">
            {categorieSelected.label}
          </span>
        </div>
        <div>
          {categoriesLoading && "Loading..."}
          <Select
            defaultInputValue={"Elige una categoria"}
            options={categories?.map((cat) => ({
              value: cat.id,
              label: cat.name,
            }))}
            onChange={handleChangeCategories}
          />
        </div>
      </div>
      <div className="bg-white p-8 mb-4">
        <div className="p-2 border-b-2 border-gray-300 mb-4">
          <h3 className="text-base">Especializaciones</h3>
        </div>
        <div>
          {categoriesLoading && "Loading..."}
          <Select
            options={subCatSelected}
            onChange={handleSubcategorieChange}
          />
        </div>
      </div>
    </div>
  );
}

export default FilterBar