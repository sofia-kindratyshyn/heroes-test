import { Link, useParams } from "react-router-dom";
import styles from "./HeroDetails.module.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteHero,
  fetchHeroById,
  type Hero,
} from "../../../servises/heroServises";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function HeroDetails() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteHero(id),
    onError: () => {
      toast.error("There was an error while deleting.");
    },
    onSuccess: () => {
      navigate("/");
      toast.success("The hero successfully deleted!");
      queryClient.invalidateQueries({ queryKey: ["heroes"] });
    },
  });
  const { isPending, data, error } = useQuery<Hero>({
    queryKey: ["herodetails", id],
    queryFn: () => fetchHeroById(id!),
    enabled: !!id,
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;
  return (
    <div className={styles.page}>
      <Toaster />
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.card + " " + styles.header}>
            <img
              src={data.images[0]}
              alt={data.nickname}
              className={styles.avatar}
            />
            <div>
              <h1 className={styles.heroName}>{data.nickname}</h1>
              <span className={styles.realName}>
                Real Name: {data.real_name}
              </span>
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Origin</h2>
            <p>{data.origin_description}</p>
          </div>

          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Superpowers</h2>
            <ul className={styles.tagList}>
              {data.superpowers
                .trim()
                .split(",")
                .map((superpower) => {
                  return <li>{superpower}</li>;
                })}
            </ul>
          </div>

          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Catch Phrase</h2>
            <p className={styles.catchPhrase}>{data.catch_phrase}</p>
          </div>

          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Gallery</h2>
            <div className={styles.gallery}>
              {data.images.map((image) => {
                return <img src={image} />;
              })}
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Actions</h2>
          <div className={styles.actions}>
            <Link to={`/edit/${id}`} className={styles.editBtn}>
              <svg width={16} height={16} aria-hidden="true">
                <use href="/symbol-defs.svg#icon-edit"></use>
              </svg>
              Edit
            </Link>
            <button
              className={styles.deleteBtn}
              onClick={() => {
                if (id) mutation.mutate(id);
              }}
            >
              <svg width={16} height={16} aria-hidden="true">
                <use href="/symbol-defs.svg#icon-delete"></use>
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
