export async function blobUrlToDataUrl(url: string) {
  try {
    let response = await fetch(url);
    let blob = await response.blob();
    return await new Promise<string | null>((resolve) => {
      let reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}
