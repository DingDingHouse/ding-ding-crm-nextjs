export function formatDate(dateString: string | null): string {
    if (!dateString) {
        return "Still Active"; // Handle null values by returning "Still Active"
    }

    const date = new Date(dateString); // Ensure dateString is valid before parsing

    return date.toLocaleDateString("en-GB", {
        weekday: "short", // Thu
        day: "numeric",   // 24
        month: "short",   // Oct
    }) + " " + date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true, // AM/PM format
    });
}

export const getTimeFromDate = (dateString: string | null): number => {
    return dateString ? new Date(dateString).getTime() : new Date(0).getTime();
};

export function formatAmount(amount:number) {
    if (amount >= 1_00_00_00_000) {
      return `${(amount / 1_00_00_00_000).toFixed(1)} Cr`; // Crore
    } else if (amount >= 1_00_00_000) {
      return `${(amount / 1_00_00_000).toFixed(1)} L`; // Lakh
    } else if (amount >= 1_000_000) {
      return `${(amount / 1_000_000).toFixed(1)}M`; // Million
    } else if (amount >= 1_000) {
      return `${(amount / 1_000).toFixed(1)}k`; // Thousand
    } else {
      return amount.toString(); // Less than 1000, no formatting
    }
  }