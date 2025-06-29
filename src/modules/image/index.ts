import { toBase64 } from '../../internal/base64';
import { deprecated } from '../../internal/deprecated';
import { ModuleBase } from '../../internal/module-base';
import type { SexType } from '../person';

/**
 * Module to generate images.
 *
 * ### Overview
 *
 * For a random image, use [`url()`](https://fakerjs.dev/api/image.html#url). This will not return the image directly but a URL pointing to an image from one of two demo image providers "Picsum" and "LoremFlickr". You can request an image specifically from one of two providers using [`urlLoremFlickr()`](https://fakerjs.dev/api/image.html#urlloremflickr) or [`urlPicsumPhotos()`](https://fakerjs.dev/api/image.html#urlpicsumphotos).
 *
 * For a random placeholder image containing only solid color and text, use [`urlPlaceholder()`](https://fakerjs.dev/api/image.html#urlplaceholder) (uses a third-party service) or [`dataUri()`](https://fakerjs.dev/api/image.html#datauri) (returns a SVG string).
 *
 * For a random user avatar image, use [`avatar()`](https://fakerjs.dev/api/image.html#avatar), or [`personPortrait()`](https://fakerjs.dev/api/image.html#personportrait) which has more control over the size and sex of the person.
 *
 * If you need more control over the content of the images, you can pass a `category` parameter e.g. `'cat'` or `'nature'` to [`urlLoremFlickr()`](https://fakerjs.dev/api/image.html#urlloremflickr) or simply use [`faker.helpers.arrayElement()`](https://fakerjs.dev/api/helpers.html#arrayelement) with your own array of image URLs.
 */
export class ImageModule extends ModuleBase {
  /**
   * Generates a random avatar image url.
   *
   * @remark This method sometimes generates a random string representing an URL from GitHub by using a random user ID. Faker is not responsible for the content of the image or the service providing it.
   *
   * @example
   * faker.image.avatar()
   * // 'https://avatars.githubusercontent.com/u/97165289'
   *
   * @since 2.0.1
   */
  avatar(): string {
    // Add new avatar providers here, when adding a new one.
    const avatarMethod = this.faker.helpers.arrayElement([
      this.personPortrait,
      this.avatarGitHub,
    ]);
    return avatarMethod();
  }

  /**
   * Generates a random avatar from GitHub.
   *
   * @remark This method generates a random string representing an URL from GitHub by using a random user ID. Faker is not responsible for the content of the image or the service providing it.
   *
   * @example
   * faker.image.avatarGitHub()
   * // 'https://avatars.githubusercontent.com/u/97165289'
   *
   * @since 8.0.0
   */
  avatarGitHub(): string {
    return `https://avatars.githubusercontent.com/u/${this.faker.number.int(
      100000000
    )}`;
  }

  /**
   * Generates a random square portrait (avatar) of a person.
   * These are static images of fictional people created by an AI, Stable Diffusion 3.
   * The image URLs are served via the JSDelivr CDN and subject to their [terms of use](https://www.jsdelivr.com/terms).
   *
   * @param options Options for generating an AI avatar.
   * @param options.sex The sex of the person for the avatar. Can be `'female'` or `'male'`. If not provided, defaults to a random selection.
   * @param options.size The size of the image. Can be `512`, `256`, `128`, `64` or `32`. If not provided, defaults to `512`.
   *
   * @example
   * faker.image.personPortrait() // 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/57.jpg'
   * faker.image.personPortrait({ sex: 'male', size: '128' }) // 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/128/27.jpg'
   *
   * @since 9.5.0
   */
  personPortrait(
    options: {
      /**
       * The sex of the person for the avatar.
       * Can be `'female'` or `'male'`.
       *
       * @default faker.person.sexType()
       */
      sex?: SexType;
      /**
       * The size of the image.
       * Can be `512`, `256`, `128`, `64` or `32`.
       *
       * @default 512
       */
      size?: 512 | 256 | 128 | 64 | 32;
    } = {}
  ): string {
    const { sex = this.faker.person.sexType(), size = 512 } = options;
    const baseURL =
      'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait';
    return `${baseURL}/${sex}/${size}/${this.faker.number.int({ min: 0, max: 99 })}.jpg`;
  }

  /**
   * Generates a random avatar from `https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar`.
   *
   * @remark This method generates a random string representing an URL from cloudflare-ipfs. Faker is not responsible for the content of the image or the service providing it.
   *
   * @example
   * faker.image.avatarLegacy()
   * // 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/170.jpg'
   *
   * @since 8.0.0
   *
   * @deprecated The links are no longer working. Use `avatar()` instead.
   */
  avatarLegacy(): string {
    deprecated({
      deprecated: 'faker.image.avatarLegacy()',
      proposed: 'faker.image.avatar() or faker.image.personPortrait()',
      since: '9.0.2',
      until: '10.0.0',
    });

    return `https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/${this.faker.number.int(
      1249
    )}.jpg`;
  }

  /**
   * Generates a random image url.
   *
   * @remark This method generates a random string representing an URL from loremflickr. Faker is not responsible for the content of the image or the service providing it.
   *
   * @param options Options for generating a URL for an image.
   * @param options.width The width of the image. Defaults to a random integer between `1` and `3999`.
   * @param options.height The height of the image. Defaults to a random integer between `1` and `3999`.
   *
   * @example
   * faker.image.url() // 'https://loremflickr.com/640/480?lock=1234'
   *
   * @since 8.0.0
   */
  url(
    options: {
      /**
       * The width of the image.
       *
       * @default faker.number.int({ min: 1, max: 3999 })
       */
      width?: number;
      /**
       * The height of the image.
       *
       * @default faker.number.int({ min: 1, max: 3999 })
       */
      height?: number;
    } = {}
  ): string {
    const {
      width = this.faker.number.int({ min: 1, max: 3999 }),
      height = this.faker.number.int({ min: 1, max: 3999 }),
    } = options;

    const urlMethod = this.faker.helpers.arrayElement([
      this.urlLoremFlickr,
      ({ width, height }: { width?: number; height?: number }) =>
        this.urlPicsumPhotos({ width, height, grayscale: false, blur: 0 }),
    ]);

    return urlMethod({ width, height });
  }

  /**
   * Generates a random image url provided via https://loremflickr.com.
   *
   * @remark This method generates a random string representing an URL from loremflickr. Faker is not responsible for the content of the image or the service providing it.
   *
   * @param options Options for generating a URL for an image.
   * @param options.width The width of the image. Defaults to a random integer between `1` and `3999`.
   * @param options.height The height of the image. Defaults to a random integer between `1` and `3999`.
   * @param options.category Category to use for the image.
   *
   * @example
   * faker.image.urlLoremFlickr() // 'https://loremflickr.com/640/480?lock=1234'
   * faker.image.urlLoremFlickr({ width: 128 }) // 'https://loremflickr.com/128/480?lock=1234'
   * faker.image.urlLoremFlickr({ height: 128 }) // 'https://loremflickr.com/640/128?lock=1234'
   * faker.image.urlLoremFlickr({ category: 'nature' }) // 'https://loremflickr.com/640/480/nature?lock=1234'
   *
   * @since 8.0.0
   */
  urlLoremFlickr(
    options: {
      /**
       * The width of the image.
       *
       * @default faker.number.int({ min: 1, max: 3999 })
       */
      width?: number;
      /**
       * The height of the image.
       *
       * @default faker.number.int({ min: 1, max: 3999 })
       */
      height?: number;
      /**
       * Category to use for the image.
       */
      category?: string;
    } = {}
  ): string {
    const {
      width = this.faker.number.int({ min: 1, max: 3999 }),
      height = this.faker.number.int({ min: 1, max: 3999 }),
      category,
    } = options;

    return `https://loremflickr.com/${width}/${height}${
      category == null ? '' : `/${category}`
    }?lock=${this.faker.number.int()}`;
  }

  /**
   * Generates a random image url provided via https://picsum.photos.
   *
   * @remark This method generates a random string representing an URL from picsum.photos. Faker is not responsible for the content of the image or the service providing it.
   *
   * @param options Options for generating a URL for an image.
   * @param options.width The width of the image. Defaults to a random integer between `1` and `3999`.
   * @param options.height The height of the image. Defaults to a random integer between `1` and `3999`.
   * @param options.grayscale Whether the image should be grayscale. Defaults to a random boolean value.
   * @param options.blur Whether the image should be blurred. `0` disables the blur. Defaults to a random integer between `0` and `10`.
   *
   * @example
   * faker.image.urlPicsumPhotos() // 'https://picsum.photos/seed/NWbJM2B/640/480'
   * faker.image.urlPicsumPhotos({ width: 128 }) // 'https://picsum.photos/seed/NWbJM2B/128/480'
   * faker.image.urlPicsumPhotos({ height: 128 }) // 'https://picsum.photos/seed/NWbJM2B/640/128'
   * faker.image.urlPicsumPhotos({ grayscale: true }) // 'https://picsum.photos/seed/NWbJM2B/640/480?grayscale'
   * faker.image.urlPicsumPhotos({ blur: 4 }) // 'https://picsum.photos/seed/NWbJM2B/640/480?blur=4'
   * faker.image.urlPicsumPhotos({ blur: 4, grayscale: true }) // 'https://picsum.photos/seed/NWbJM2B/640/480?grayscale&blur=4'
   *
   * @since 8.0.0
   */
  urlPicsumPhotos(
    options: {
      /**
       * The width of the image.
       *
       * @default faker.number.int({ min: 1, max: 3999 })
       */
      width?: number;
      /**
       * The height of the image.
       *
       * @default faker.number.int({ min: 1, max: 3999 })
       */
      height?: number;
      /**
       * Whether the image should be grayscale.
       *
       * @default faker.datatype.boolean()
       */
      grayscale?: boolean;
      /**
       * Whether the image should be blurred. `0` disables the blur.
       *
       * @default faker.number.int({ max: 10 })
       */
      blur?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    } = {}
  ): string {
    const {
      width = this.faker.number.int({ min: 1, max: 3999 }),
      height = this.faker.number.int({ min: 1, max: 3999 }),
      grayscale = this.faker.datatype.boolean(),
      blur = this.faker.number.int({ max: 10 }),
    } = options;

    let url = `https://picsum.photos/seed/${this.faker.string.alphanumeric({
      length: { min: 5, max: 10 },
    })}/${width}/${height}`;

    const hasValidBlur = typeof blur === 'number' && blur >= 1 && blur <= 10;

    if (grayscale || hasValidBlur) {
      url += '?';

      if (grayscale) {
        url += `grayscale`;
      }

      if (grayscale && hasValidBlur) {
        url += '&';
      }

      if (hasValidBlur) {
        url += `blur=${blur}`;
      }
    }

    return url;
  }

  /**
   * Generates a random image url provided via https://via.placeholder.com/.
   *
   * @remark This method generates a random string representing an URL from via.placeholder. Faker is not responsible for the content of the image or the service providing it.
   *
   * @param options Options for generating a URL for an image.
   * @param options.width The width of the image. Defaults to a random number between 1 and 3500.
   * @param options.height The height of the image. Defaults to a random number between 1 and 3500.
   * @param options.backgroundColor The background color of the image. Defaults to a random hex color.
   * @param options.textColor The text color of the image. Defaults to a random hex color.
   * @param options.format The format of the image. Defaults to a random format.
   * @param options.text The text to display on the image. Defaults to a random string.
   *
   * @example
   * faker.image.urlPlaceholder() // 'https://via.placeholder.com/150x180/FF0000/FFFFFF.webp?text=lorem'
   * faker.image.urlPlaceholder({ width: 128 }) // 'https://via.placeholder.com/128x180/FF0000/FFFFFF.webp?text=lorem'
   * faker.image.urlPlaceholder({ height: 128 }) // 'https://via.placeholder.com/150x128/FF0000/FFFFFF.webp?text=lorem'
   * faker.image.urlPlaceholder({ backgroundColor: '000000' }) // 'https://via.placeholder.com/150x180/000000/FFFFFF.webp?text=lorem'
   * faker.image.urlPlaceholder({ textColor: '000000' }) // 'https://via.placeholder.com/150x180/FF0000/000000.webp?text=lorem'
   * faker.image.urlPlaceholder({ format: 'png' }) // 'https://via.placeholder.com/150x180/FF0000/FFFFFF.png?text=lorem'
   * faker.image.urlPlaceholder({ text: 'lorem ipsum' }) // 'https://via.placeholder.com/150x180/FF0000/FFFFFF.webp?text=lorem+ipsum'
   * faker.image.urlPlaceholder({ width: 128, height: 128, backgroundColor: '000000', textColor: 'FF0000', format: 'png', text: 'lorem ipsum' }) // 'https://via.placeholder.com/128x128/000000/FF0000.png?text=lorem+ipsum'
   *
   * @since 8.0.0
   *
   * @deprecated The service has bad uptime. Use `faker.image.url()` or `faker.image.dataUri()` instead.
   */
  urlPlaceholder(
    options: {
      /**
       * The width of the image.
       *
       * @default faker.number.int({ min: 1, max: 3500 })
       */
      width?: number;
      /**
       * The height of the image.
       *
       * @default faker.number.int({ min: 1, max: 3500 })
       */
      height?: number;
      /**
       * The background color of the image.
       *
       * @default faker.color.rgb({ format: 'hex', prefix: '' })
       */
      backgroundColor?: string;
      /**
       * The text color of the image.
       *
       * @default faker.color.rgb({ format: 'hex', prefix: '' })
       */
      textColor?: string;
      /**
       * The format of the image.
       *
       * @default faker.helpers.arrayElement(['gif', 'jpeg', 'jpg', 'png', 'webp'])
       */
      format?: 'gif' | 'jpeg' | 'jpg' | 'png' | 'webp';
      /**
       * The text to display on the image.
       *
       * @default faker.lorem.words()
       */
      text?: string;
    } = {}
  ): string {
    deprecated({
      deprecated: 'faker.image.urlPlaceholder()',
      proposed: 'faker.image.url() or faker.image.dataUri()',
      since: '9.4.0',
      until: '10.0.0',
    });

    const {
      width = this.faker.number.int({ min: 1, max: 3500 }),
      height = this.faker.number.int({ min: 1, max: 3500 }),
      backgroundColor = this.faker.color.rgb({ format: 'hex', prefix: '' }),
      textColor = this.faker.color.rgb({ format: 'hex', prefix: '' }),
      format = this.faker.helpers.arrayElement([
        'gif',
        'jpeg',
        'jpg',
        'png',
        'webp',
      ]),
      text = this.faker.lorem.words(),
    } = options;

    let url = `https://via.placeholder.com`;

    url += `/${width}`;
    url += `x${height}`;

    url += `/${backgroundColor}`;
    url += `/${textColor}`;

    url += `.${format}`;

    url += `?text=${encodeURIComponent(text)}`;

    return url;
  }

  /**
   * Generates a random data uri containing an URL-encoded SVG image or a Base64-encoded SVG image.
   *
   * @param options Options for generating a data uri.
   * @param options.width The width of the image. Defaults to a random integer between `1` and `3999`.
   * @param options.height The height of the image. Defaults to a random integer between `1` and `3999`.
   * @param options.color The color of the image. Must be a color supported by svg. Defaults to a random color.
   * @param options.type The type of the image. Defaults to a random type.
   *
   * @example
   * faker.image.dataUri() // 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http...'
   * faker.image.dataUri({ type: 'svg-base64' }) // 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3...'
   *
   * @since 4.0.0
   */
  dataUri(
    options: {
      /**
       * The width of the image.
       *
       * @default faker.number.int({ min: 1, max: 3999 })
       */
      width?: number;
      /**
       * The height of the image.
       *
       * @default faker.number.int({ min: 1, max: 3999 })
       */
      height?: number;
      /**
       * The color of the image. Must be a color supported by svg.
       *
       * @default faker.color.rgb()
       */
      color?: string;
      /**
       * The type of the image to return. Consisting of
       * the file extension and the used encoding.
       *
       * @default faker.helpers.arrayElement(['svg-uri', 'svg-base64'])
       */
      type?: 'svg-uri' | 'svg-base64';
    } = {}
  ): string {
    const {
      width = this.faker.number.int({ min: 1, max: 3999 }),
      height = this.faker.number.int({ min: 1, max: 3999 }),
      color = this.faker.color.rgb(),
      type = this.faker.helpers.arrayElement(['svg-uri', 'svg-base64']),
    } = options;

    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" baseProfile="full" width="${width}" height="${height}"><rect width="100%" height="100%" fill="${color}"/><text x="${
      width / 2
    }" y="${
      height / 2
    }" font-size="20" alignment-baseline="middle" text-anchor="middle" fill="white">${width}x${height}</text></svg>`;

    return type === 'svg-uri'
      ? `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgString)}`
      : `data:image/svg+xml;base64,${toBase64(svgString)}`;
  }
}
