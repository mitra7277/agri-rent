import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function TestimonialSlider() {
  const data = [
    {
      name: "Rahul Verma",
      role: "Farmer, UP",
      text: "AgriRent se tractor hire karna bohot easy ho gaya. Rates affordable hain aur service fast.",
      img: "https://randomuser.me/api/portraits/men/31.jpg",
    },
    {
      name: "Priya Sharma",
      role: "Farm Owner, MP",
      text: "Availability check feature is amazing! Last minute booking bhi smooth hoti hai.",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Raghav Singh",
      role: "Operator, Bihar",
      text: "Owner dashboard clean & structured hai. Daily ka earning clarity milti hai.",
      img: "https://randomuser.me/api/portraits/men/52.jpg",
    },
    {
      name: "Anjali Patel",
      role: "Farmer, Gujarat",
      text: "5-minute booking process ne mere kaam ko fast bana diya. Highly recommended!",
      img: "https://randomuser.me/api/portraits/women/12.jpg",
    },
  ];

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>What Our Users Say</h2>
      <p style={styles.sub}>Trusted by farmers & machine owners across India 🚜</p>

      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 2500 }}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          600: { slidesPerView: 2 },
          900: { slidesPerView: 3 },
        }}
        style={{ paddingBottom: 40 }}
      >
        {data.map((t, i) => (
          <SwiperSlide key={i}>
            <div style={styles.card}>
              <img src={t.img} alt="user" style={styles.img} />
              <h3 style={styles.name}>{t.name}</h3>
              <p style={styles.role}>{t.role}</p>
              <p style={styles.text}>"{t.text}"</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

const styles = {
  wrapper: {
    marginTop: 50,
    textAlign: "center",
    padding: "20px",
  },
  title: {
    fontSize: 32,
    fontWeight: 800,
    color: "var(--primary)",
  },
  sub: {
    fontSize: 15,
    opacity: 0.7,
    marginBottom: 25,
  },
  card: {
    background: "rgba(255,255,255,0.2)",
    backdropFilter: "blur(12px)",
    padding: 20,
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.2)",
    boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
    height: "100%",
  },
  img: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: 10,
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },
  name: {
    fontSize: 18,
    fontWeight: 700,
  },
  role: {
    fontSize: 13,
    opacity: 0.6,
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    opacity: 0.85,
    lineHeight: 1.5,
  },
};
