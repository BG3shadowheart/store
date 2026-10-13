HOW TO USE YOUR OWN PRODUCT IMAGES
==================================

By default every product gets original generated SVG artwork, so you do not
need any images at all. If you would rather use real artwork:

1. Put your image file in this folder, for example:

       public/art/br-mods-pc.jpg

2. Open src/data/products.ts and add two lines to that product:

       image: '/art/br-mods-pc.jpg',
       imageAlt: 'BR MODS PC key art',

3. Save and rebuild (npm run dev / npm run build).

Next.js will serve it with next/image: responsive sizes, lazy loading and
automatic AVIF/WebP conversion on Vercel. Remove the `image` line at any time
to go back to the generated artwork.

Recommended: 16:10 landscape, at least 1200 x 750 px, under ~400 KB each.
Supported formats: .jpg .jpeg .png .webp .avif .svg

Do not upload artwork you do not have the rights to use.


HERO BACKGROUND
===============
Save an image as public/art/hero.jpg (or .png / .webp / .avif, ~1920x1080) and it
becomes the home page hero background automatically. Delete it to go back to the
generated artwork.
