import {
  deleteHero,
  getHeroes,
  getHeroById,
  updateHero,
  postHero,
} from '../services/superheroes.js';
import { imagesSavingDir } from '../utils/imagesSavingDir.js';

export const getHeroByIdController = async (req, res) => {
  const { id } = req.params;
  const result = await getHeroById(id);

  return res.json({
    status: 200,
    message: `Got superhero with id: ${id}`,
    data: result,
  });
};
export const postHeroController = async (req, res) => {
  const payload = { ...req.body };
  if (req.files && req.files.length > 0) {
    const urls = await Promise.all(
      req.files.map((file) => imagesSavingDir(file)),
    );
    payload.images = urls;
  }
  const result = await postHero(payload);

  return res.json({
    status: 201,
    message: 'Successfuly created superhero!',
    data: result,
  });
};

export const deleteHeroController = async (req, res) => {
  const { id } = req.params;
  await deleteHero(id);
  return res.json({
    status: 204,
    message: `Successfuly deleted hero with id : ${id}`,
  });
};
export const putHeroController = async (req, res) => {
  const { id } = req.params;
  const payload = { ...req.body };

  if (req.file) {
    const url = await imagesSavingDir(req.file);
    payload.images = url;
  }
  const result = await updateHero(payload, id);
  return res.json({
    status: 200,
    message: 'Successfuly updated Superhero!',
    data: result,
  });
};
export const getHeroesController = async (req, res) => {
  const { page, perPage, search } = req.query;
  const result = await getHeroes({
    page,
    perPage,
    search
  });
  return res.json({
    status: 200,
    message: 'Successfuly got Superheroes!',
    data: result,
  });
};
