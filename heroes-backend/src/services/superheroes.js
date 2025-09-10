import createHttpError from 'http-errors';
import { pool } from '../db/db.js';

export const getHeroes = async ({ page = 1, perPage = 10 }) => {
  const offset = (page - 1) * perPage;

  const heroesList = await pool.query(
    'SELECT * FROM heroes ORDER BY id LIMIT $1 OFFSET $2',
    [perPage, offset],
  );

  const countResult = await pool.query('SELECT COUNT(*) FROM heroes');
  const total = parseInt(countResult.rows[0].count, 10);

  return {
    data: heroesList.rows,
    page,
    perPage,
    total,
    totalPages: Math.ceil(total / perPage),
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
      payload.images,
      id,
    ],
  );
  return updatedHero.rows[0];
};

//nickname, real_name, origin_description, superpowers, catch_phrase, images;
