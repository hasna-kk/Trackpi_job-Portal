const CreatorCard = ({ image, name, role }) => {
  return (
    <div className="bg-[#FFC107] rounded-2xl shadow-lg p-6 flex flex-col items-center text-center w-full max-w-[360px]">
      
      {/* Image */}
      <div className="w-full aspect-square bg-white rounded-xl overflow-hidden mb-4">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Text */}
      <h3 className="text-base font-semibold text-black">{name}</h3>
      <p className="text-sm text-black/70">{role}</p>
    </div>
  );
};

export default CreatorCard;
