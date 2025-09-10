import axios from "axios";

export interface Hero {
  nickname: string;
  real_name: string;
  origin_description: string;
  superpowers: string;
  catch_phrase: string;
  images: string[];
  id: number;
}

export interface HeroResponse {
  status: number;
  message: string;
  data: {
    heroes: Hero[];
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export interface HeroForm {
  nickname: string;
  real_name: string;
  origin_description: string;
  superpowers: string;
  catch_phrase: string;
  images: FileList;
}

axios.defaults.baseURL = "https://heroes-test.onrender.com";

export async function fetchHeroes(
  page = 1,
  searchedValue?: string
): Promise<HeroResponse['data']> {
  const url = searchedValue
    ? `/superhero?page=${page}&perPage=5&search=${searchedValue}`
    : `/superhero?page=${page}&perPage=5`;

  const res = await axios.get<HeroResponse>(url);

  return res.data.data;
}

export const fetchHeroById = async (id: string): Promise<Hero> => {
  const res = await axios.get(`/superhero/${id}`);
  return res.data.data;
};

export const deleteHero = async (id: string) => {
  const res = await axios.delete(`/superhero/${id}`);
  return res.data.data;
};

export const createHero = async (data: FormData) => {
  const res = await axios.post("/superhero", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res;
};

export const updateHero = async (id: string, payload: FormData) => {
  const res = await axios.put(`/superhero/${id}`, payload);
  return res;
};
