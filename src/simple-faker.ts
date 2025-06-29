import { randomSeed } from './internal/seed';
import { DatatypeModule } from './modules/datatype';
import { SimpleDateModule } from './modules/date';
import { SimpleHelpersModule } from './modules/helpers';
import { SimpleLocationModule } from './modules/location';
import { NumberModule } from './modules/number';
import { StringModule } from './modules/string';
import type { Randomizer } from './randomizer';
import { generateMersenne53Randomizer } from './utils/mersenne';

/**
 * This is a simplified Faker class that doesn't need any localized data to generate its output.
 *
 * It only includes methods from:
 * - `datatype`
 * - `date` (without `month` and `weekday`)
 * - `helpers` (without `fake`)
 * - `location` (`latitude`, `longitude` and `nearbyGPSCoordinate` only)
 * - `number`
 * - `string`
 *
 * @example
 * import { simpleFaker } from '@faker-js/faker';
 * // const { simpleFaker } = require('@faker-js/faker');
 *
 * // simpleFaker.seed(1234);
 *
 * simpleFaker.number.int(10); // 4
 * simpleFaker.string.uuid(); // 'c50e1f5c-86e8-4aa9-888e-168e0a182519'
 */
export class SimpleFaker {
  protected _defaultRefDate: () => Date = () => new Date();

  /**
   * Gets a new reference date used to generate relative dates.
   */
  get defaultRefDate(): () => Date {
    return this._defaultRefDate;
  }

  /**
   * Sets the `refDate` source to use if no `refDate` date is passed to the date methods.
   *
   * @param dateOrSource The function or the static value used to generate the `refDate` date instance.
   * The function must return a new valid `Date` instance for every call.
   * Defaults to `() => new Date()`.
   *
   * @see [Reproducible Results](https://fakerjs.dev/guide/usage.html#reproducible-results)
   * @see faker.seed(): For generating reproducible values.
   *
   * @example
   * faker.seed(1234);
   *
   * // Default behavior
   * // faker.setDefaultRefDate();
   * faker.date.past(); // Changes based on the current date/time
   *
   * // Use a static ref date
   * faker.setDefaultRefDate(new Date('2020-01-01'));
   * faker.date.past(); // Reproducible '2019-07-03T08:27:58.118Z'
   *
   * // Use a ref date that changes every time it is used
   * let clock = new Date("2020-01-01").getTime();
   * faker.setDefaultRefDate(() => {
   *   clock += 1000; // +1s
   *   return new Date(clock);
   * });
   *
   * faker.defaultRefDate() // 2020-01-01T00:00:01Z
   * faker.defaultRefDate() // 2020-01-01T00:00:02Z
   *
   * @since 8.0.0
   */
  setDefaultRefDate(
    dateOrSource: string | Date | number | (() => Date) = () => new Date()
  ): void {
    if (typeof dateOrSource === 'function') {
      this._defaultRefDate = dateOrSource;
    } else {
      this._defaultRefDate = () => new Date(dateOrSource);
    }
  }

  /** @internal */
  private readonly _randomizer: Randomizer;

  readonly datatype: DatatypeModule = new DatatypeModule(this);
  readonly date: SimpleDateModule = new SimpleDateModule(this);
  readonly helpers: SimpleHelpersModule = new SimpleHelpersModule(this);
  readonly location: SimpleLocationModule = new SimpleLocationModule(this);
  readonly number: NumberModule = new NumberModule(this);
  readonly string: StringModule = new StringModule(this);

  /**
   * Creates a new instance of SimpleFaker.
   *
   * In nearly any case you should use the prebuilt `simpleFaker` instances instead of the constructor.
   *
   * @param options The options to use.
   * @param options.randomizer The Randomizer to use.
   * Specify this only if you want to use it to achieve a specific goal,
   * such as sharing the same random generator with other instances/tools.
   * Defaults to faker's Mersenne Twister based pseudo random number generator.
   * @param options.seed The initial seed to use.
   * The seed can be used to generate reproducible values.
   * Refer to the `seed()` method for more information.
   * Defaults to a random seed.
   *
   * @example
   * import { SimpleFaker } from '@faker-js/faker';
   * // const { SimpleFaker } = require('@faker-js/faker');
   *
   * // create a SimpleFaker without any locale data
   * const customSimpleFaker = new SimpleFaker();
   *
   * customSimpleFaker.helpers.arrayElement(['red', 'green', 'blue']); // 'green'
   * customSimpleFaker.number.int(10); // 4
   *
   * @since 8.1.0
   */
  constructor(
    options: {
      /**
       * The Randomizer to use.
       * Specify this only if you want to use it to achieve a specific goal,
       * such as sharing the same random generator with other instances/tools.
       *
       * @default generateMersenne53Randomizer()
       */
      randomizer?: Randomizer;

      /**
       * The initial seed to use.
       * The seed can be used to generate reproducible values.
       *
       * Refer to the `seed()` method for more information.
       *
       * Defaults to a random seed.
       */
      seed?: number;
    } = {}
  ) {
    const { randomizer, seed } = options;

    if (randomizer != null && seed != null) {
      randomizer.seed(seed);
    }

    this._randomizer = randomizer ?? generateMersenne53Randomizer(seed);
  }

  /**
   * Sets the seed or generates a new one.
   *
   * Please note that generated values are dependent on both the seed and the
   * number of calls that have been made since it was set.
   *
   * This method is intended to allow for consistent values in tests, so you
   * might want to use hardcoded values as the seed.
   *
   * In addition to that it can be used for creating truly random tests
   * (by passing no arguments), that still can be reproduced if needed,
   * by logging the result and explicitly setting it if needed.
   *
   * @param seed The seed to use. Defaults to a random number.
   *
   * @returns The seed that was set.
   *
   * @see [Reproducible Results](https://fakerjs.dev/guide/usage.html#reproducible-results)
   * @see faker.setDefaultRefDate(): For generating reproducible relative dates.
   *
   * @example
   * // Consistent values for tests:
   * faker.seed(42)
   * faker.number.int(10); // 4
   * faker.number.int(10); // 10
   *
   * faker.seed(42)
   * faker.number.int(10); // 4
   * faker.number.int(10); // 10
   *
   * // Random but reproducible tests:
   * // Simply log the seed, and if you need to reproduce it, insert the seed here
   * console.log('Running test with seed:', faker.seed());
   *
   * @since 6.0.0
   */
  seed(seed?: number): number;
  /**
   * Sets the seed array.
   *
   * Please note that generated values are dependent on both the seed and the
   * number of calls that have been made since it was set.
   *
   * This method is intended to allow for consistent values in a tests, so you
   * might want to use hardcoded values as the seed.
   *
   * In addition to that it can be used for creating truly random tests
   * (by passing no arguments), that still can be reproduced if needed,
   * by logging the result and explicitly setting it if needed.
   *
   * @param seedArray The seed array to use.
   *
   * @returns The seed array that was set.
   *
   * @see [Reproducible Results](https://fakerjs.dev/guide/usage.html#reproducible-results)
   * @see faker.setDefaultRefDate(): For generating reproducible relative dates.
   *
   * @example
   * // Consistent values for tests:
   * faker.seed([42, 13, 17])
   * faker.number.int(10); // 3
   * faker.number.int(10); // 10
   *
   * faker.seed([42, 13, 17])
   * faker.number.int(10); // 3
   * faker.number.int(10); // 10
   *
   * // Random but reproducible tests:
   * // Simply log the seed, and if you need to reproduce it, insert the seed here
   * console.log('Running test with seed:', faker.seed());
   *
   * @since 6.0.0
   */
  seed(seedArray: number[]): number[];
  /**
   * Sets the seed or generates a new one.
   *
   * Please note that generated values are dependent on both the seed and the
   * number of calls that have been made since it was set.
   *
   * This method is intended to allow for consistent values in a tests, so you
   * might want to use hardcoded values as the seed.
   *
   * In addition to that it can be used for creating truly random tests
   * (by passing no arguments), that still can be reproduced if needed,
   * by logging the result and explicitly setting it if needed.
   *
   * @param seed The seed or seed array to use.
   *
   * @returns The seed that was set.
   *
   * @see [Reproducible Results](https://fakerjs.dev/guide/usage.html#reproducible-results)
   * @see faker.setDefaultRefDate(): For generating reproducible dates.
   *
   * @example
   * // Consistent values for tests (using a number):
   * faker.seed(42)
   * faker.number.int(10); // 4
   * faker.number.int(10); // 10
   *
   * faker.seed(42)
   * faker.number.int(10); // 4
   * faker.number.int(10); // 10
   *
   * // Consistent values for tests (using an array):
   * faker.seed([42, 13, 17])
   * faker.number.int(10); // 3
   * faker.number.int(10); // 10
   *
   * faker.seed([42, 13, 17])
   * faker.number.int(10); // 3
   * faker.number.int(10); // 10
   *
   * // Random but reproducible tests:
   * // Simply log the seed, and if you need to reproduce it, insert the seed here
   * console.log('Running test with seed:', faker.seed());
   *
   * @since 6.0.0
   */
  seed(seed?: number | number[]): number | number[];
  seed(seed: number | number[] = randomSeed()): number | number[] {
    this._randomizer.seed(seed);

    return seed;
  }
}

export const simpleFaker = new SimpleFaker();
