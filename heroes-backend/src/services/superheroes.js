import createHttpError from 'http-errors';
import { pool } from '../db/db.js';

export const getHeroes = async ({ page = 1, perPage = 5, search }) => {
  const currentPage = Number(page) || 1;
  const currentPerPage = Number(perPage) || 5;
  const offset = (currentPage - 1) * currentPerPage;

  let heroesList;

  if (search) {
    heroesList = await pool.query(
      'SELECT * FROM heroes WHERE nickname ILIKE $1 ORDER BY id LIMIT $2 OFFSET $3',
      [`%${search}%`, currentPerPage, offset],
    );
  } else {
    heroesList = await pool.query(
      'SELECT * FROM heroes ORDER BY id LIMIT $1 OFFSET $2',
      [currentPerPage, offset],
    );
  }

  const countResult = search
    ? await pool.query('SELECT COUNT(*) FROM heroes WHERE nickname ILIKE $1', [
        `%${search}%`,
      ])
    : await pool.query('SELECT COUNT(*) FROM heroes');

  const total = parseInt(countResult.rows[0].count, 10);

  return {
    heroes: heroesList.rows,
    page: currentPage,
    perPage: currentPerPage,
    total,
    totalPages: Math.ceil(total / currentPerPage),
  };
};

export const getHeroById = async (id) => {
  const result = await pool.query('SELECT * FROM heroes WHERE id = $1', [id]);

  if (result.rows.length === 0) {
    return createHttpError(404, 'Suprhero not found');
  }
  return result.rows[0];
};

export const deleteHero = async (id) => {
  await pool.query('DELETE FROM heroes WHERE id = $1', [id]);
};

export const postHero = async (payload) => {
  const createdHero = await pool.query(
    `INSERT INTO heroes
      (nickname, real_name, origin_description, superpowers, catch_phrase, images)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      payload.nickname,
      payload.real_name,
      payload.origin_description,
      payload.superpowers,
      payload.catch_phrase,
      payload.images,
    ],
  );
  return createdHero.rows[0];
};

export const updateHero = async (payload, id) => {
  const existendImages = await pool.query('SELECT images FROM heroes WHERE id = $1', [id]);
  const imagesToSave = existendImages.rows[0].images.push(...payload.images);
  const updatedHero = await pool.query(
    `UPDATE heroes
     SET nickname=$1, real_name=$2, origin_description=$3, superpowers=$4, catch_phrase=$5, images=$6
     WHERE id=$7
     RETURNING *`,
    [
      payload.nickname,
      payload.real_name,
      payload.origin_description,
      payload.superpowers,
      payload.catch_phrase,
      imagesToSave,
      id,
    ],
  );
  return updatedHero.rows[0];
};

