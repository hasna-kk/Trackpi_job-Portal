export const calculateProfileStrength = (profile) => {
    let strength = 0;
    if (!profile) return { strength: 0, isComplete: false };

    // Regex for URL validation
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)*\/?$/i;

    // 1. Core Info (15%)
    if (profile.fullName && profile.fullName.trim()) strength += 5;
    if (profile.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) strength += 5;
    if (profile.phone && profile.phone.length >= 10) strength += 5;

    // 2. Personal Details (10%)
    if (profile.dateOfBirth) strength += 5;
    if (profile.maritalStatus) strength += 5;

    // 3. Professional Essentials (30%)
    if (profile.jobTitle && profile.jobTitle.trim() !== "") strength += 5;
    if (profile.summary && profile.summary.trim() !== "") strength += 10;
    if (profile.skills && profile.skills.length > 0) strength += 10;
    if (profile.languages && profile.languages.length > 0) strength += 5;

    // 4. History (25%)
    if (profile.education && profile.education.length > 0) strength += 10;
    if (profile.workExperience && profile.workExperience.length > 0) strength += 15; // Increased weight

    // 5. Assets & Social (20%)
    if (profile.profileImage && profile.profileImage.trim() !== "" && profile.profileImage !== "null") strength += 10;
    if (profile.resumeUrl && profile.resumeUrl.trim() !== "" && profile.resumeUrl !== "null") strength += 5; // Reduced to 5 as requested

    // Social Links (Check if any exist and are valid)
    const hasValidSocial = profile.socialLinks && Object.values(profile.socialLinks).some(link =>
        link && typeof link === 'string' && link.trim() !== "" && link !== "null" && urlPattern.test(link.trim())
    );
    if (hasValidSocial) strength += 5;

    // Cap at 100
    strength = Math.min(strength, 100);
    const isComplete = strength >= 100;

    return { strength, isComplete };
};
