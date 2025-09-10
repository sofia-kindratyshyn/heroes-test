import { useForm } from "react-hook-form";
import styles from "./CreateHero.module.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  createHero,
  fetchHeroById,
  updateHero,
} from "../../servises/heroServises";
import { useEffect } from "react";
import { useHeroDraftStore } from "../../servises/states/heroDraft";

interface HeroForm {
  nickname: string;
  real_name: string;
  origin_description: string;
  superpowers: string;
  catch_phrase: string;
  images: FileList;
}

const CreateEditHero = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isSubmitSuccessful, errors },
  } = useForm<HeroForm>();

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      fetchHeroById(id).then((heroData) => {
        reset({
          nickname: heroData.nickname,
          real_name: heroData.real_name,
          origin_description: heroData.origin_description,
          superpowers: heroData.superpowers,
          catch_phrase: heroData.catch_phrase,
        });
        setDraft({
          nickname: heroData.nickname,
          real_name: heroData.real_name,
          origin_description: heroData.origin_description,
          superpowers: heroData.superpowers,
          catch_phrase: heroData.catch_phrase,
        });
      });
    }
  }, [id, reset]);

  const onSubmit = async (data: HeroForm) => {
    try {
      const formData = new FormData();
      formData.append("nickname", data.nickname);
      formData.append("real_name", data.real_name);
      formData.append("origin_description", data.origin_description);
      formData.append("superpowers", data.superpowers);
      formData.append("catch_phrase", data.catch_phrase);
      if (data.images && data.images.length > 0) {
        Array.from(data.images).forEach((file) =>
          formData.append("images", file)
        );
      }
      if (id) {
        await updateHero(id, formData);
      } else {
        await createHero(formData);
      }
      reset();
      clearDraft();
    } catch (err) {
      console.error("Error uploading hero:", err);
    }
  };

  const { draft, setDraft, clearDraft } = useHeroDraftStore();

  useEffect(() => {
    if (!id && draft) {
      reset({
        nickname: draft.nickname,
        real_name: draft.real_name,
        origin_description: draft.origin_description,
        superpowers: draft.superpowers,
        catch_phrase: draft.catch_phrase,
      });
    }
  }, [id, draft, reset]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target
    setDraft(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
      <h1 className={styles.title}>Create / Edit Superhero</h1>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Nickname</label>
          <input
            className={styles.input}
            placeholder="e.g., Night Falcon"
            {...register("nickname", { required: "Nickname is required", onChange: handleChange })}
          />
          {errors.nickname && (
            <span className={styles.error}>{errors.nickname.message}</span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Real Name</label>
          <input
            className={styles.input}
            placeholder="e.g., Alex Vega"
            
            {...register("real_name", { onChange: handleChange })}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Origin Description</label>
        <textarea
          className={styles.textarea}
          placeholder="Brief backstory..."
          {...register("origin_description", { onChange: handleChange })}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Superpowers</label>
        <textarea
          className={styles.textarea}
          placeholder="List powers separated by commas"
          {...register("superpowers", { onChange: handleChange })}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Catch Phrase</label>
        <input
          className={styles.input}
          placeholder='e.g., "From the shadows above, justice descends."'
          {...register("catch_phrase", { onChange: handleChange })}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Images</label>
          <input type="file" multiple accept="image/*"{...register("images")} />
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancel}
          onClick={() => {
            navigate("/");
          }}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button type="button" className={styles.cancel} onClick={() => {clearDraft(); reset()}}>
          Clear Form
        </button>
        <button type="submit" className={styles.save} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Hero"}
        </button>
      </div>

      {isSubmitSuccessful && (
        <p style={{ color: "green", marginTop: "8px" }}>
          Hero saved successfully!
        </p>
      )}
    </form>
  );
};

export default CreateEditHero;
