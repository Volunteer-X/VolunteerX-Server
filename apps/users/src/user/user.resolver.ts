import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveReference,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import {
  CreateUserInput,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
  UnknownError,
  UpdateUserInput,
} from './graphql/user.schema';
import { GraphQLObjectID } from 'graphql-scalars';
import { TUser } from 'libs/utils/entities';
import { Logger, UseGuards } from '@nestjs/common';
import { CurrentUser, GqlAuthGuard } from '@app/auth';
import { WrappedPayload } from '../common';

@Resolver('User')
export class UserResolver {
  constructor(private readonly usersService: UserService) {}
  private readonly logger = new Logger(UserResolver.name);
  private readonly wrapPayload = new WrappedPayload();

  @Query('user')
  @UseGuards(GqlAuthGuard)
  getUser(@CurrentUser() user: TUser) {
    return this.wrapPayload.wrap(user);
  }

  @Query('isUsernameAvailable')
  isUsernameAvailable(@Args('username') username: string) {
    return this.usersService.isUsernameAvailable(username);
  }

  @Query('userById')
  getUserById(
    @Args({ name: 'id', type: () => GraphQLObjectID })
    id: typeof GraphQLObjectID,
  ) {
    return this.usersService.findOne(GraphQLObjectID.parseValue(id));
  }

  @Mutation('createUser')
  create(@Args('payload') payload: CreateUserInput) {
    console.log('payload', payload);

    return this.usersService.createUser(payload);
  }

  @Mutation('updateUser')
  updateUser(@Args('payload') payload: UpdateUserInput) {
    return this.usersService.update(payload);
  }

  @ResolveReference()
  resolveReference(reference: {
    __typename: string;
    id: typeof GraphQLObjectID;
  }) {
    console.log('reference', reference);

    return this.usersService.findOne(GraphQLObjectID.parseValue(reference.id));
  }

  // @ResolveField('ping')
  // pings(@Parent() user: User) {
  //   this.logger.log('user', user);
  //   return { __typename: 'User', id: user.id };
  // }
}
